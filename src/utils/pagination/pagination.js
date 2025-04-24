export const pagination = (page, size) => {
    page = Math.max(page, 1);
    const limit = Math.max(size, 1);
    const skip = size * (page - 1);

    return { skip, limit };
}