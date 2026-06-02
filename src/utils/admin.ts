export const checkUserExists = (user: any) => {
    if (user) {
        throw new Error("This user already exists");
    }
};