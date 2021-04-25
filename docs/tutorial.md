# THPL Tutorial

## Program Header & Footer

Every THPL program has a program header and a program footer. They are of below form:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>My First HTML Program</title>
    <script src="https://unpkg.com/the-html-programming-language@0.1.0/browser.min.js"></script>
  </head>
  <body>
    <!-- Your program -->
  </body>
</html>
```

Within the program header, you can specify the title of your program (between `<title>` and `</title>`). Also, modify the `@0.1.0` part to specify THPL version.

## P Statement and Expressions

Your program is placed between `<body>` and `</body>`. A program is a sequence of **statements**. The most basic statement is the **P statement**. A P statement contains an **expression** in it. When a P statement is to be executed, the expression in it is executed.

The first expression you learn is the OUTPUT expression. When executed an OUTPUT expression prints given value to the console.

Example:

```html
<p><output>Hello, world!</output></p>
```

The OUTPUT expression itself takes an expression in it. In this example, a plain text `Hello, world!` is given. A plain text is considered as an expression that returns its text itself.

The return value of an OUTPUT expression is the value given to the OUTPUT expression.

## Variables

With the DL statement, you can declare variables. In a DL statement are pairs of DT and DD elements. Each DT element declares the name of a variable and the subsequent DD element contains a value to be set to that variable.

Variables can be accessed through the VAR expressions of form `<var>name</var>`.

Example:

```html
<dl>
  <dt>str1</dt>
  <dd>Hello</dd>
  <dt>str2</dt>
  <dd>world</dd>
</dl>
<p>
  <output><var>str1</var>, <var>str2</var>!</output>
</p>
```

As you can observe in the above example, multiple expressions can be placed in sequence to form a single expression. The value of such expression is a string concatination of values from expressions in it.

## Functions

Declare a function with the SECTION statement. A SECTION statement must have a `title` attribute that defines the name of function. Function body comes inside the SECTION element. When a SECTION element is evaluated, a resulting function object is set to the variable of the specified name.

To call a function, use the ABBR expression. Use its `title` attribute to specify the variable name that contains a function.

Example:

```html
<section title="say_hello">
  <p>
    <output>Hello,</output>
  </p>
</section>
<p>
  <abbr title="say_hello"></abbr>
</p>
<p>
  <output> world!</output>
</p>
```

An alternative way of calling a function is to access the function object via the VAR expression. Specifying that object as a child of an ABBR object has the effect of calling that function.

Example:

```html
<section title="say_hello">
  <p>
    <output>Hello,</output>
  </p>
</section>
<p>
  <abbr><var>say_hello</var></abbr>
</p>
<p>
  <output> world!</output>
</p>
```

### Function Parameters

Functions can receive parameters. From inside a function, parameters can be accessed using the SLOT expression. The first parameter is returned by `<slot></slot>`. To access the second parameter, use `<slot name="1"></slot>` and so on. The first parameter can also be accessed with `<slot name="0"></slot>`.

To pass parameters when calling a function, put a parameter in the ABBR element. Multiple parameters are seprarated by `<br>`.

Example:

```html
<section title="say">
  <p>
    <output><slot name="0"></slot>, <slot name="1"></slot>!</output>
  </p>
</section>
<p>
  <abbr title="say">Hello<br />world</abbr>
</p>
```

When not using the `title` attribute of the ABBR expression, the function object and the first parameter are also separated by `<br>`.

### Return Values

Functions can have a return value. A return value is specified with the FOOTER statement. When a FOOTER statement is executed insider a function, an expression in the FOOTER statement is executed its value becomes the return value.

Example:

```html
<section title="say_return">
  <footer><slot name="0"></slot>, <slot name="1"></slot>!</footer>
</section>
<p>
  <output
    ><abbr title="say_return">Hello<br />world</abbr></output
  >
</p>
```

## Arithmetics

Arithmetic operations are provided in form of functions. These function have to be taken from the math namespace. The next example uses the `plus` function from the math namespace.

Example:

```html
<dl>
  <dt>sum</dt>
  <dd>
    <abbr>
      <math><plus /></math><br />
      10<br />
      15
    </abbr>
  </dd>
</dl>
<p>
  <output>10 + 15 = <var>sum</var></output>
</p>
```

The math namespace provides following functions: `add`, `minus`, `times`, `divide`, `power`, `rem`, `gcd`, `min`, `max`, `lt`, `gt`, `leq`, `geq`, `and`, `or`, `xor` and `implies`.

Returned values of all math functions are numbers. For boolean operations, `1` is returned for true and `0` is returned for false.

In case a parameter passed to math functions are not a number, it is implicitly converted to number. In the above example, both `10` and `15` are passed as string and are converted to numbers.

In order to explicitly convert strings to numbers, the METER expression can be utilized.

```html
<dl>
  <dt>sum</dt>
  <dd>
    <abbr>
      <math><plus /></math><br />
      <meter>10</meter><br />
      <meter>15</meter>
    </abbr>
  </dd>
</dl>
<p>
  <output>10 + 15 = <var>sum</var></output>
</p>
```

## Conditional Branching

The feature of conditional branching is provided as the RUBY expression. It works similarly as `switch` statements in other languages; given values are compared to branch conditions in sequence and the matched branch is executed. The RUBY expression has the following form:

```html
expression
<ruby>
  condition1
  <dt>branch1</dt>
  condition2
  <dt>branch2</dt>
  <dt>else branch</dt>
</ruby>
```

This expression first evaluates `expression`. It is then compared to the value of `condition1`. If they are equal, `branch1` is executed and its value is returned as the result of the RUBY expression. If not, then `expression` value is compared to `condition2`, and so on.
The last `dt` element without accompanying condition is the optional "else" branch. If given value does not match any branch above, then this "else" branch is executed. In case there is no "else" branch, `null` is returned as a result of such RUBY expression.

Example:

```html
<section title="odd_even">
  <footer>
    <abbr>
      <math><rem /></math><br />
      <slot></slot><br />
      2
    </abbr>
    <ruby>
      <meter>0</meter>
      <dt>even</dt>
      <meter>1</meter>
      <dt>odd</dt>
    </ruby>
  </footer>
</section>
<p>
  <output>15 is <abbr title="odd_even">15</abbr>.<wbr /></output>
</p>
<p>
  <output>-2 is <abbr title="odd_even">-2</abbr>.<wbr /></output>
</p>
```

This example defines a function named `odd_even` which returns a string `even` when given parameter is an even number. It returns a string `odd` when given parameter is an odd number. It first computes given parameter mod 2 and then performs a branching against that value.

Note that the use of METER expressions in conditions are mandatory because the RUBY expression does not automatically perform a conversion between strings and numbers. Since return values of math operations are numbers, it only matches with numbers.
