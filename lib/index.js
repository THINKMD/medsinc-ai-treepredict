var self = module.exports = {

    startPoint: function(rule) {
        /**
         * Function to determine the necessary starting index in the rule variable
         */

        var startIndex = 0;
        var pos = rule.lastIndexOf("&");
        if (pos !== -1) {
            startIndex = pos + 2;
        }
        return startIndex;
    },

    varOfInterest: function(start, rule) {
        /**
         * Function to determine the variable of interest.  Takes the rule starting point
         * as input and returns the variable of interest.
         */

        var category = "";
        for (var i = start; i < rule.length; i++) {
            if (rule[i] === " ") {
                break;
            }
            else {
                category = category + rule[i];
            }
        }
        return category;
    },

    typeRule: function(rule, start) {
        /**
         * Function that determines what type the rule is (vector, >, <, >=, <=, undefined)
         * Returns type as a string
         */
        var type = "";
        var rulePart = rule.slice(start, rule.length - 1);
        if (rulePart.search("%in%") != -1) {
            type = "vector";
        }
        else if (rulePart.search("<=") != -1) {
            type = "lessThanOrEqual";
        }
        else if (rulePart.search(">=") != -1) {
            type = "greaterThanOrEqual";
        }
        else if (rulePart.search("<") != -1) {
            type = "lessThan";
        }
        else if (rulePart.search(">") != -1) {
            type = "greaterThan";
        }
        else {
            type = "undefined"
        }

        return type;
    },
    
    ruleFunction: function(rule, encounter) {
        /**
         * Main function to determine if encounter follows node rule.
         * Calls startPoint(), varOfInterest(), and typeRule()
         * Returns boolean
         */

        var start = this.startPoint(rule);
        //     console.log("start: " + start);

        var category = this.varOfInterest(start, rule);
        //     console.log("category: " + category);

        var type = this.typeRule(rule, start);
        //     console.log("type: " + type);

        if (type === "vector") {
            var check = encounter[category];
            //         console.log("check: "+ check);

            if (check === undefined) return false

            var vec = rule.slice(start + category.length + 8, rule.length - 1).replace(/['"]+/g, '').split(",");
            //         console.log("vector: "+vec);

            for (var i = 0; i < vec.length; i++) {
                vec[i] = vec[i].trim();
                if (check.toString().toUpperCase() === vec[i].toString().toUpperCase()) {
                    return true;
                }
            }
            return false;
        }
        else if (type == "lessThan") {
            var check = parseFloat(encounter[category]);
            //         console.log("check: " + check);

            var ruleNum = parseFloat(rule.slice(start, rule.length).match(/[+-]?\d+(\.\d+)?/g)[0]);
            //         console.log("ruleNum: " + ruleNum);

            return check < ruleNum;
        }
        else if (type = "greaterThanOrEqual") {
            var check = parseFloat(encounter[category]);
            //         console.log("check: " + check);

            var ruleNum = parseFloat(rule.slice(start, rule.length).match(/[+-]?\d+(\.\d+)?/g)[0]);
            //         console.log("ruleNum: " + ruleNum);

            return check >= ruleNum;
        }
        else if (type = "lessThanOrEqual") {
            var check = parseFloat(encounter[category]);
            //         console.log("check: " + check);

            var ruleNum = parseFloat(rule.slice(start, rule.length).match(/[+-]?\d+(\.\d+)?/g)[0]);
            //         console.log("ruleNum: " + ruleNum);

            return check <= ruleNum;
        }
        else if (type = "greaterThan") {
            var check = parseFloat(encounter[category]);
            //         console.log("check: " + check);

            var ruleNum = parseFloat(rule.slice(start, rule.length).match(/[+-]?\d+(\.\d+)?/g)[0]);
            //         console.log("ruleNum: " + ruleNum);

            return check >= ruleNum;
        }
        else {
            console.log("Error: Type is not specified");
        }
    },

    //*************************
    //code to traverse the tree
    //*************************

    predict: function(encounter, tree) {
        var data = tree

        var numChildren = 2;
        var x = data.children[0]; //left child
        var x_prev = data; //save previous node in case of rule failure

        while (numChildren !== 0) {
            if (this.ruleFunction(x.rule, encounter) === false) {
                //         console.log("Heading to the second child...")
                x = x_prev.children[1] //take the right child
            }

            if (x.children !== undefined) {
                numChildren = x.children.length;
                x_prev = x;
                x = x.children[0];
            }
            else {
                numChildren = 0;
            }
        }

        var value = x.prediction; //gets the prediction
        return value;
    }
}
