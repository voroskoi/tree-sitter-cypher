module.exports = grammar({
  name: 'cypher',

  rules: {
    source_file: $ => repeat($.query),

    query: $ => seq(
      $.token,
      seq($.node, repeat(
        seq($.relationship, $.node)
      ))
    ),

    token: $ => choice(
      'CREATE',
      'MATCH'
    ),

    string: $ => seq("'", /[a-zA-Z]*/, "'"),

    parameter: $ => seq('{', $.argument, ':', $.string, '}'),

    node: $ => seq('(', optional(choice($._declaration, $.variable)), ')'),

    _identifier: $ => /[a-zA-Z]*/,

    variable: $ => $._identifier,
    argument: $ => $._identifier,
    _declaration: $ => seq(optional($.variable), ':', $.argument, optional($.parameter)),

    relationship_details: $ => seq('[', optional($._declaration), ']'),

    _relationship_left: $ => seq('<-', optional($.relationship_details), '-'),
    _relationship_right: $ => seq('-', optional($.relationship_details), '->'),
    _relationship_left_right: $ => seq('-', optional($.relationship_details), '-'),

    relationship: $ => choice(
      $._relationship_left,
      $._relationship_right,
      $._relationship_left_right
    )
  }
});
