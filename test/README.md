Breakout Test Suite
===

Unit tests were written with [mocha](http://visionmedia.github.com/mocha/), [chai](http://chaijs.com/) (for assertions) and [sinon](http://sinonjs.org/) 
(for spies and stubs).

The IOBoard unit tests use fixture data that was sampled from each of the tested
board types. Currently the capabilities of the following boards are tested:

- Arduino Uno
- Arduino Mega 2560
- Arduino Leonardo
- Arduino Fio
- Teensy 2.0
- Teensy++ 2.0

IOBoard.js handles the communication with the physical board and the Firmata 
protocol implementation so a passing IOBoard test suite indicates that the core 
functionality is behaving as expected for each of the Arduino board variants 
listed above.


Running Tests
---

Tests can be run in the browser or from the command line. Before running tests,
disconnect any boards connected to your computer. The tests run against 
sampled data in the fixtures directory rather than a connected board. Any 
connected boards may actually interfere with the tests.

To run tests in the browser:

1. Navigate to src/tests/core/ and open runner.html in your browser.
2. The tests should run and you should see a green check next to each test 
indicating that it has passed.

To run tests from the command line:

1. Ensure you have [phantomJS](http://phantomjs.org/) and [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs) installed.
2. Navigate to the Breakout root directory and type:
```mocha-phantomjs test/core/runner.html```. Also see mocha-phantomjs documentation for additional options.
3. The tests should run and you should see a green check next to each test 
indicating that it has passed.

Tests are also run automatically at the end of the build process (kicked off by 
running the build script in Breakout/build/). Tests will only run automatically
if phantom and mocha-phantomjs are installed.
