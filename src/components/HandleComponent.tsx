import React from 'react';

const HandleComponent = ({ rotation }: { rotation: number }) => {
    return (
        <div
            className='w-5 h-5 rounded-full shadow-sm border bg-white border-zinc-200 transition hover:bg-primary rotate-[90deg]'
            style={{ transform: `rotate(${rotation}deg)` }}
        />
    );
};

export default HandleComponent;