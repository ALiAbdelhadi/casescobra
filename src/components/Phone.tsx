import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
    imgSrc: string;
    dark?: boolean;
}

const Phone = ({ className, imgSrc, dark = false, ...props }: PhoneProps) => {
    return (
        <div
            className={cn(
                "relative pointer-events-none z-50 overflow-hidden ",
                className
            )}
            {...props}
        >
            <Image
                src={
                    dark
                        ? "/phone-template-dark-edges.png"
                        : "/phone-template-white-edges.png"
                }
                alt={"Phone image"}
                className="pointer-events-none z-50 select-none"
                width={896}
                height={1831}
                quality={100}
            />
            <div className={"absolute -z-10 inset-0"}>
                <Image src={imgSrc} alt={"overlying-phone-image "} className="object-cover min-w-full min-h-full"width={896}
                height={1831} quality={100}/>
            </div>
        </div>
    );
};
export default Phone;
