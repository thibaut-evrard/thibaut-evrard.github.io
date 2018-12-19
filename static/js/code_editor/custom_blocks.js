Blockly.defineBlocksWithJsonArray([
  {
  "type": "move_forward",
  "message0": "move forward %1 steps",
  "args0": [
    {
      "type": "field_number",
      "name": "DISTANCE",
      "value": 0,
      "min": 0,
      "max": 20,
      "precision": 1
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "turn",
  "message0": "turn %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "left",
          "LEFT"
        ],
        [
          "right",
          "RIGHT"
        ]
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "main",
  "message0": "when 'a' is pressed%1",
  "args0": [
    {
      "type": "input_statement",
      "name": "MAIN"
    }
  ],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "jump",
  "message0": "jump %1",
  "args0": [
    {
      "type": "field_number",
      "name": "HEIGHT",
      "value": 10,
      "min": 0,
      "max": 40,
      "precision": 1
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 330,
  "tooltip": "",
  "helpUrl": ""
}
]);

// BLOCKS CODE -----------------------------------------------------------------

Blockly.JavaScript['move_forward'] = function(block) {
  var number_distance = block.getFieldValue('DISTANCE');
  // TODO: Assemble JavaScript into code variable.
  //var code = 'console.log( \'move forward \' +' + number_distance + '+ \'steps \');\n';
  var code = 'forward('+number_distance+');\n'
  code += 'await sleep(2000); \n'
  return code;
};

Blockly.JavaScript['turn'] = function(block) {
  var dropdown_name = '\'' + block.getFieldValue('NAME') + '\'';
  var direction;
  if(dropdown_name === 'LEFT') direction = 1;
  else direction = -1;
  // TODO: Assemble JavaScript into code variable.
  var code = 'turn('+direction+');\n'
  return code;
};

Blockly.JavaScript['main'] = function(block) {
  var statements_main = Blockly.JavaScript.statementToCode(block, 'MAIN');
  // TODO: Assemble JavaScript into code variable.
  var code =  'async function run() {\n' + statements_main + '} \n run();'
  return code;
};

Blockly.JavaScript['jump'] = function(block) {
  var number_height = block.getFieldValue('HEIGHT');
  // TODO: Assemble JavaScript into code variable.
  var code = 'cab.jump('+number_height+');\n';
  return code;
};
