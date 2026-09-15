import { verifyJWT } from './../middleware/auth.middleware';
import express from "express"
import { upload } from "../middleware/multer.middleware";
import { loginUser, 
         logoutUser, 
         registerUser, 
         refreshAccessToken, 
         getCurrectUser, 
         changeCurrectPassword,
         updateBio,
         updateProfileImage,
         getUserProfileData,
         followUser,
         unfollowUser
        } from "../controllers/user.controller";


const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser)

router.post("/login", loginUser)

router.post("/refresh-token", refreshAccessToken)

//secured routes

router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrectUser);
router.post("/change-password", verifyJWT, changeCurrectPassword);
router.post("/add-bio", verifyJWT, updateBio);
router.post("/update-profile-image", verifyJWT, upload.single("profileImage"), updateProfileImage)
router.get("/get-user-profile-data/:username", verifyJWT, getUserProfileData)
router.post("/follow/:username", verifyJWT,followUser);
router.post("/unfollow/:username", verifyJWT, unfollowUser);  

export default router