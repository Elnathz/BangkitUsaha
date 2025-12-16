// Fungsi untuk mendapatkan User saat ini dari LocalStorage
export const getCurrentUser = () => {
    const storedUser = localStorage.getItem("bangkit-user");
    if (storedUser) {
        return JSON.parse(storedUser);
    }

    // Jika belum ada user (pertama kali buka), buat user random sementara
    const newUser = {
        id: "user-" + Date.now() + Math.floor(Math.random() * 1000),
        name: "Pengguna Baru",
        role: "pedagang", // pedagang atau pembeli
        avatar: "https://github.com/shadcn.png",
    };

    localStorage.setItem("bangkit-user", JSON.stringify(newUser));
    return newUser;
};

// Fungsi untuk update data user
export const updateUserProfile = (name: string, role: string) => {
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, name, role };
    localStorage.setItem("bangkit-user", JSON.stringify(updatedUser));
    return updatedUser;
};
