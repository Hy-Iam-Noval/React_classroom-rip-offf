export default (props: {datas?:string}) => { 
   return props.datas ?
      <p className="text-base text-red-700 font-medium">{props.datas}</p> :
      <></>
}