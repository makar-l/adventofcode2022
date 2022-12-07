const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';
const linePartsSeparator = ' ';

class FileSystem {
    constructor() {
        this.path = [];
        this.filesTree = {
            size: 0,
            parent: null,
            files: {},
            dirs: {},
        };
        this.currentDir = this.filesTree;
    }

    down(dir) {
        this.path.push(dir);

        this.calcCurrentDir();
    }

    up() {
        this.path = this.path.slice(0, -1);

        this.calcCurrentDir();
    }

    reset() {
        this.path = [];

        this.calcCurrentDir();
    }

    calcCurrentDir() {
        this.currentDir = this.filesTree;
        this.path.forEach(dir => {
           if (!this.currentDir.dirs[dir]) {
               this.currentDir.dirs[dir] = {
                   size: 0,
                   parent: this.currentDir,
                   files: {},
                   dirs: {},
               };
           }

           this.currentDir = this.currentDir.dirs[dir];
        });
    }

    addFile(size, name) {
        if (!this.currentDir.files[name]) {
            let current = this.currentDir;

            while (current) {
                current.size += size;

                current = current.parent;
            }
        }

        this.currentDir.files[name] = size;
    }

    getSumOfDirSizesLessThen(size) {
        const iter = (parentDir, result) => {
            if (parentDir.size <= size) {
                console.log(parentDir.size);
                result += parentDir.size;
            }

            const childDirs = parentDir.dirs ? Object.values(parentDir.dirs) : [];

            return childDirs.length === 0 ? result : childDirs.reduce((acc, curr) => {
                return acc + iter(curr, 0);
            }, result);
        };

        return iter(this.filesTree, 0);
    };
}


const getSmallFoldersSize = data => {
    const fileSystem = new FileSystem();

    const terminalLines = data.trim().split(lineSeparator);

    const execCD = dir => {
        switch (dir) {
            case '..':
                fileSystem.up();
                break;
            case '/':
                fileSystem.reset();
                break;
            default:
                fileSystem.down(dir);
                break;
        }
    };

    const addLineToTree = lineParts => {
        if (lineParts[0] !== 'dir') {
            const fileSize = parseInt(lineParts[0]);
            const fileName = lineParts[1];

            fileSystem.addFile(fileSize, fileName);
        }
    };

    terminalLines.forEach(line => {
       const parts = line.trim().split(linePartsSeparator);

       if (parts[0] === '$') {
           const command = parts[1];

           switch (command) {
               case 'cd':
                   const dir = parts[2];
                   execCD(dir);
                   break;
           }
       } else {
            addLineToTree(parts);
       }
    });

    return fileSystem.getSumOfDirSizesLessThen(100000);
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const smallFoldersSize = getSmallFoldersSize(data);

console.log(smallFoldersSize);
