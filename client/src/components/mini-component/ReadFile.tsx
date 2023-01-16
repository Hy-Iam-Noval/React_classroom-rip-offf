export default (props: {file: FileList}) => {
   const {file} = props
   const firstFile = file.item(0)
   const listFile = Object.values(file).map(({type, name})=>({type,name}))
   const nameFile = listFile.map(i=>i.name).join(', ')
   const url = 
      !listFile.every(i=>i.type.match(/image/)) ?
         `${process.env.PUBLIC_URL}/assets/default-file-photo.png` :
      listFile.length > 1 ?
         `${process.env.PUBLIC_URL}/assets/default-img-photo.png`:
         URL.createObjectURL(firstFile!)
   
   return <>
      {file.length > 1 ? 
         <div 
            className={`w-96 h-60 bg-center bg-no-repeat`}
            >
            <p>{listFile.length}</p>
         </div> :
         <img className="max-w-sm max-h-60" src={url} alt="" />
      }
   </>
}