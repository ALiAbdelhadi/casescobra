"use server"
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const createCheckoutSession = async ({ configId }) => {
  console.log("Starting createCheckoutSession with configId:", configId)

  const configuration = await db.configuration.findUnique({
    where: { id: configId }
  })

  if (!configuration) {
    throw new Error("No such configuration found")
  }

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error("You need to be logged in")
  }

  // طباعة معرف المستخدم من Kinde Auth
  console.log("User ID from Kinde Auth:", user.id)

  let dbUser = await db.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    // إذا كان المستخدم غير موجود، قم بإنشائه
    if (!user.email) {
      throw new Error("User email is missing from Kinde Auth")
    }

    dbUser = await db.user.create({
      data: {
        id: user.id,
        email: user.email
      }
    })
  }

  console.log("User found or created in database:", dbUser)

  const { finish, material } = configuration

  let price = BASE_PRICE
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate

  let order = undefined

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id
    }
  })

  console.log("Existing order:", existingOrder)

  if (existingOrder) {
    order = existingOrder
  } else {
    try {
      order = await db.order.create({
        data: {
          amount: price / 100,
          userId: user.id,
          configurationId: configuration.id
        }
      })
      console.log("Order created:", order)
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price
    }
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["EG"] },
    metadata: {
      userId: user.id,
      orderId: order.id
    },
    line_items: [{ price: product.default_price, quantity: 1 }]
  })

  console.log("Stripe session created:", stripeSession)

  return { url: stripeSession.url }
}
