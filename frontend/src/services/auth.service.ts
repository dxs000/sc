import api from "../lib/axios";
import type { RegisterUserFormData, LoginUserFormData } from "../schemas/auth.schema";

export const registerUser = async (data: RegisterUserFormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    if (data.profileImage && data.profileImage.length > 0) {
        formData.append("profileImage", data.profileImage[0]);
    }

    const response = await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
};

export const loginUser = async (data: LoginUserFormData) => {
    const payload = data.identifier.includes("@")
        ? { email: data.identifier, password: data.password }
        : { username: data.identifier, password: data.password };

    const response = await api.post("/users/login", payload);
    return response.data.user;
};

export const getCurrentUser = async () => {
    const response = await api.get("/users/current-user");
    return response.data.user;
};
