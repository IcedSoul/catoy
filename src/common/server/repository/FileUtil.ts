import fs from 'fs'

export const readFile = async (name: string) => {
    return fs.readFileSync(`./data/${name}`, 'utf-8');
}

export const appendFile = async (name: string, content: string) => {
    fs.appendFileSync(`./data/${name}`, content.concat(",\n"));
}

export const writeFile = async (name: string, content: string) => {
    fs.writeFileSync(`./data/${name}`, '');
}