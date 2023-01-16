import { flashKey } from "src/shared/util"

export default () => {
   const msg = localStorage.getItem(flashKey)
   localStorage.removeItem(flashKey)

   return msg && <div className="fixed w-[30vw] top-20 left-1/2 -translate-x-1/2 border">
      test
   </div>
} 