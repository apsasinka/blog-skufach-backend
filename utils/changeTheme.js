let themeValue = 'light';

const changeTheme = (req, res) => {
    const { newThemeValue } = req.params;

    if (newThemeValue === 'light' || newThemeValue === 'dark') {
        themeValue = newThemeValue; 
        res.status(200).json({ message: 'Тема успешно изменена', newThemeValue }); // Отправляем новое значение темы обратно на фронтенд
    } else {
        res.status(400).json({ error: 'Недопустимое значение темы' });
    }
};

export default changeTheme;
