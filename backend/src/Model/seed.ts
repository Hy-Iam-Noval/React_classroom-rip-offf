import { v4 } from "uuid"
import {init, prisma} from "./BasicQuery/init"
import {hash} from '../Supports/support';

async function seed(){
   await prisma.users.create({
      data:{
         name: "upang", email: "upang2", password: hash("213"),
         admin:{
            create:{
               name: "acumalaka",
               uuid: v4(),
               members:{
                  create:{
                     userId: 1
                  }
               },
               task:{
                  create:{
                     name: "Task test",
                     senderId: 1
                  }
               }
            }
         },
         
      }
   })

   await prisma.users.create({
      data : { 
         email: "member@gmail.com",
         name: "member",
         password: "213", 
         memberInClass:{
            create: { 
               classId: 1
            }
         }
      }  
   })
}

seed().then(async()=>{
   const ada = await init.user.getUser("member@gmail.com")
   const kosong = await init.user.getUser("memadadawdwadwa@gmail.com")

   console.log(`ada : ${ada}`);
   console.log(`kosong : ${kosong}`);
   
   console.log("done")
})