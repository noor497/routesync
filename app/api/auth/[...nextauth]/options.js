import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../(models)/User";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";

export const options = {
  pages: {
    signIn: "/login", // Replace with your custom login page path (e.g., /login)
  },
  providers: [
    GitHubProvider({
      profile(profile) {
        // console.log("Profile GitHub: ", profile);

        let userRole = "GitHub User";
        if (profile?.email == "jake@claritycoders.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_Secret,
    }),
    GoogleProvider({
      async profile(profile) {
        // console.log("Profile Google: ", profile);
        const foundUser = await User.findOne({ email: profile.email })

          let userRole = "Google User";
          return {
            ...profile,
            image : profile.picture,
            id: profile.sub,
            role: userRole,
          };
        

      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec();
            if (!foundUser){
              throw new Error('No user found')
              return { message: "Not registered. Please create an account." };
            }
            else if (foundUser) {
            console.log("User Exists");
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );

            if (match) {
              console.log("Good Pass");
              delete foundUser.password;

              foundUser["role"] = "Unverified Email";
              return foundUser;
            }
          }

        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {

        // For Google sign-in
        if (account.provider === 'google') {
          // const foundUser = await User.findOne({ email: credentials.email })
          const existingUser = await User.findOne({ email: user.email });

          // if (existingUser && existingUser.type !== 'google') {
          //   throw new Error('This email is already registered with a different sign-in method.');
          // }

          if (!existingUser) {
            await User.create({
              google_id: profile.sub,
              email: user.email,
              name: user.name,
              image: user.image || profile.picture,
              type: 'google',
            });
          }
          else if (existingUser && existingUser.type == "credentials"){
            await User.updateOne(
              { email: user.email },
              { $set: { name: user.name, image: user.image || profile.picture,type : "credentials + google" , google_id: profile.sub } }
            );
          }
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // console.log("TOKEN : ",token , "USERR : ",user);
      const toGetId = await User.findOne(
        { email: token.email }
        
      );
      if (user) {token.role = user.role;
        token.userId = toGetId._id
      };
      return token;
    },
    async session({ session, token }) {
      // console.log("SESSIONN : ",session , "TOKEN : ",token);
      if (session?.user) {
        session.user.role = token.role;
        const toGetId = await User.findOne(
          { email: session.user.email }
          
        );
        // console.log("GETID : " ,toGetId);
      session.user.status = "authenticated";
    session.user.userId = toGetId._id}
    session.user.id = token.userId;
      return session;
    },
  },
};