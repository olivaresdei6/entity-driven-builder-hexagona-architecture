const replacePlaceholders = (template, placeholders) => {
    let content = template;
    for (const [key, value] of Object.entries(placeholders)) {
        const regex = new RegExp(`\\$${key}\\$`, 'g');
        content = content.replace(regex, value);
    }
    return content;
};

module.exports = { replacePlaceholders };
