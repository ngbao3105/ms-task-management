export function getStringWithSensitiveCase(inputString: string) {
    return inputString?.toLowerCase()
        ?.normalize('NFD')
        ?.replace(/\p{Diacritic}/gu, '')
        .trim();
}
