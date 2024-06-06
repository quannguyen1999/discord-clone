// import { currentProfile } from "@/lib/current-profile";
// import { redirectToSignIn } from "@clerk/nextjs/server";

// const ServerIdLayout = async ({
//     children,
//     params
// } : {
//     children: React.ReactNode;
// }) => {
//     const profile = await currentProfile();

//     if(!profile){
//         return redirectToSignIn();
//     }

//     return (
//         <div>
//             {children}
//         </div>
//     )
// }

// export default ServerIdLayout;