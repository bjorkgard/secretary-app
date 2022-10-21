module.exports = {
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue/blob/44ff0e02cd0fd08b8cd7dee0127dbb5590446323/docs/user-guide/README.md#conflict-with-prettier
        'plugin:vue/vue3-recommended',
    ],
    plugins: [
        "align-assignments",
        "align-import",
    ],
    rules: {
        'vue/multi-word-component-names' : 'off',
        "no-multi-spaces"                : ["error", {"exceptions": {"AssignmentExpression": true, "ImportDeclaration": true, "VariableDeclarator": true }}],
        "align-import/align-import"      : "error",
        "key-spacing"                    : ["error", {
            "mode"  : "minimum",
            "align" : {
                "beforeColon" : true,
                "afterColon"  : true,
                "on"          : "colon"
            }
        }],
        "align-assignments/align-assignments": [2, { "requiresOnly": false } ],
    },
}
