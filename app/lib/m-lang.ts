import { LanguageSupport, StreamLanguage } from "@codemirror/language";

interface MLanguageState {
    inComment: boolean;
    inString: boolean;
}

// M Code (Power Query) language definition for CodeMirror
const mLanguage = StreamLanguage.define<MLanguageState>({
    name: "mcode",

    token(stream, state) {
        // Handle whitespace
        if (stream.eatSpace()) return null;

        // Handle comments
        if (stream.match("//")) {
            stream.skipToEnd();
            return "comment";
        }
        if (stream.match("/*")) {
            state.inComment = true;
            return "comment";
        }
        if (state.inComment) {
            if (stream.match("*/")) {
                state.inComment = false;
            } else {
                stream.next();
            }
            return "comment";
        }

        // Handle strings
        if (stream.match(/"([^"]|"")*"/)) {
            return "string";
        }
        if (stream.peek() === '"') {
            stream.next();
            state.inString = true;
            return "string";
        }
        if (state.inString) {
            if (stream.match('""')) {
                return "string";
            }
            if (stream.peek() === '"') {
                stream.next();
                state.inString = false;
                return "string";
            }
            stream.next();
            return "string";
        }

        // Handle keywords
        const keywords = /^(let|in|if|then|else|each|try|otherwise|error|type|as|is|and|or|not|meta|section|shared|null|true|false)(?![\w])/;
        if (stream.match(keywords, false)) {
            stream.match(keywords);
            return "keyword";
        }

        // Handle built-in functions
        const builtins = /^(Table\.|List\.|Text\.|Number\.|Date\.|DateTime\.|Duration\.|Record\.|Type\.|Binary\.|Comparer\.|Splitter\.|Combiner\.|Replacer\.|Expression\.|Error\.|Function\.|Lines\.|Uri\.|Value\.|#[a-z]+)/i;
        if (stream.match(builtins, false)) {
            stream.match(builtins);
            return "builtin";
        }

        // Handle numbers
        if (stream.match(/^[0-9]+\.?[0-9]*/)) {
            return "number";
        }

        // Handle operators
        if (stream.match(/^(<>|<=|>=|=>|\.\.)/)) {
            return "operator";
        }
        if (stream.match(/^[+\-*\/=<>&@!?]/)) {
            return "operator";
        }

        // Handle identifiers
        if (stream.match(/^#?"?[a-zA-Z_][a-zA-Z0-9_\.]*"?/)) {
            return "variable";
        }

        // Handle other characters
        stream.next();
        return null;
    },

    startState() {
        return {
            inComment: false,
            inString: false
        };
    },
});

export function mCode() {
    return new LanguageSupport(mLanguage);
}
