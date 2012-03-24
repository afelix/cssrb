**CSSRB** переименовывает пути к файлам в `url()`, а также копирует / перемещает эти файлы.

## Установка

Перед установкой следует убедиться, что уже установлены:

 * Node.js (platform built on Chrome's JavaScript runtime) — [nodejs.org](http://nodejs.org)
 * npm (package manager for node) — [npmjs.org](http://npmjs.org/)

Выполнить в command-line:

    npm install cssrb -g

## Использование

Сначала следует создать конфгурационный файл со следующей структурой: 

```js
exports.config = {
    fromBase: '/src/dir/name/', // <- абсолютный путь
    toBase:  '/dst/dir/name/', // <- абсолютный путь
    patterns: { // <- может быть более одного
        'regular expression': 'new/dir/', // <- относительный путь
        '..': '..'
    }
};
```

Здесь:
 * **fromBase** — полный путь к корневому каталогу файлов, отсюда CSSRB копирует.
 * **toBase** — полный путь к корневому каталогу файлов, сюда CSSRB копирует.
 * **patterns** — пары значений `{ re: dir }`, состоящие из регулярного выражения, с которым CSSRB будет сверять пути к файлам, и путём, в который переименовать, если совпало.

Алгоритм простой, его следует понимать, чтобы лучше писать конфигурационный файл:
 * взять из `url()` путь к файлу — `inPath`;
 * сверить его с шаблонами;
 * если совпадение найдено, взять из `inPath` имя файла (для `/my/file.png` это `file.png`) и присоединить к `dir` из совпавшей пары, после чего заменить в CSS старый путь на новый;
 * если при запуске CSSRB был указан ключ `-mv`, переместить файл из `fromBase + inPath` в `toBase + dir + fileName`;
 * или, если при запуске CSSRB был указан ключ `-cp`, скопировать файл из `fromBase + inPath` в `toBase + dir + fileName`.

Пример конфигурационного файла [.cssrb.js](https://github.com/afelix/cssrb/blob/master/sample/.cssrb.js):

```js
exports.config = {
    fromBase: '/Users/user/projects/cssrb/sample/',
    toBase:  '/Users/user/projects/cssrb/sample/',
    patterns: {
        '^/?from': '/to/'
    }
};
```

Пример CSS [sample.css](https://github.com/afelix/cssrb/blob/master/sample/sample.css):

```css
a {
    test: url(/from/sample.png)
}
```

Запуск (из корня проекта `cssrb`):

    cssrb -c sample/.cssrb.js sample/sample.css sample/_sample.css -cp

В результате появился каталог `sample/to` с файлом `sample.png`, а `_sample.css` выглядит так:

```css
a {
    test: url('/to/sample.png')
}
```

## Справка:

    cssrb
        показывает этот текст
    cssrb -h
    cssrb --help
        показывает этот текст
    cssrb -c <config_path>
    cssrb --config <config_path>
        указывает путь к конфигурационному файлу
    cssrb -cp
    cssrb --copy
        копировать файлы
    cssrb -mv
    cssrb --move
        перемещать файлы
    csso <in_имя_файла> <out_имя_файла>
    csso -i <in_имя_файла> -o <out_имя_файла>
    csso --input <in_имя_файла> --output <out_имя_файла>
        переименовывает URL'ы в <in_имя_файла> и записывает результат в <out_имя_файла>
    cssrb -v
    cssrb --version
        показывает номер версии
