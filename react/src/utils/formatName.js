export const formatName = (name) => {
    if (!name) return '';
    const parts = name.split('_');
    if (parts.length < 2 || !parts[1]) return name;
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const last = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${firstInitial}.${last}`;
};
