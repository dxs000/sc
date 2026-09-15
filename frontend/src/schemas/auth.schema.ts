import z from 'zod';

export const registerUserSchema = z.object({
    username: z.string().min(3, "Имя пользователя должно содержать не менее 3 символов"),
    email: z.email("Некорректный email"),
    password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
    confirmPassword: z.string().min(6, "Повторите пароль"),
    profileImage: z.instanceof(FileList)
    .optional()
    .refine((files) => !files ||  files.length <= 1, "Можно загрузить только одно фото")
    .refine((files) => !files ||  files.length === 0 || 
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0].type),
            "Допустимы только изображения (jpg, png, webp)")
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
});

export const loginUserSchema = z.object({
    identifier: z.string().min(1, "Укажите имя пользователя или email"),
    password: z.string().min(6, "Пароль должен содержать не менее 6 символов")
})

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type LoginUserFormData = z.infer<typeof loginUserSchema>;
