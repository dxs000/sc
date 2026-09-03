import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { error } from "node:console";
import { ApiError } from "../utils/apiError";

const test = async (req:Request,res:Response) => {
  try{
      return res.status(200).json(new ApiResponse(200, {}, "API is working fine"));
    } catch(err){
        console.log("Error: ", err);

        
        if(err instanceof ApiError){
            const statusCode = err instanceof ApiError ? err.statusCode : 500
            const message = err instanceof ApiError ? err.message : "Internal Server Error"
            const errors = err instanceof ApiError? err.errors: []
            
            return res.status(statusCode).json({
            success: false,
            message: message,
            errors: errors || []
                     
            })

        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: []
                     
        })

    }  
};

export { test };