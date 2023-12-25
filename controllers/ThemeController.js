let themeValue = 'light';

export const changeTheme = (req, res) => {
    const { newThemeValue } = req.params;

    if (newThemeValue === 'light' || newThemeValue === 'dark' || newThemeValue === 'pink' || newThemeValue === 'green') {
        themeValue = newThemeValue;
        res.status(200).json({ message: 'Тема успешно изменена', newThemeValue });
    } else {
        res.status(400).json({ error: 'Недопустимое значение темы' });
    }
};

export const getTheme = (req, res) => {
    const currentTheme = themeValue; 

    res.status(200).json({ currentTheme });
};

