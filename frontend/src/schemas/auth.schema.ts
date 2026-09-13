import z from 'zod';

export const registerUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid e-mail address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    profileImage: z.instanceof(FileList)
    .optional()
    .refine((files) => !files ||  files.length <= 1, "Only one profile picture is allowed")
    .refine((files) => !files ||  files.length === 0 || 
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0].type),
            "Only image files are allowed (jpg, png, webp)")
});

export const loginUserSchema = z.object({
    identifier: z.string().min(1, "Username or e-mail is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type LoginUserFormData = z.infer<typeof loginUserSchema>;