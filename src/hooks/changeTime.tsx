
export const calculateTime=(second:number)=>{
    const minuts=Math.floor(second / 60)
    const resMinut=minuts<10? `0${minuts}` : `${minuts}`
    const seconds=Math.floor(second % 60)
    const resSecond=seconds<10? `0${seconds}` : `${seconds}`
    return `${resMinut}:${resSecond}`
}