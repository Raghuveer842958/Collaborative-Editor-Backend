exports.supportedLanguage = [
  {
    name: "JS",
    id: 63,
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    name: "TS",
    id: 74,
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    name: "C",
    id: 50,
    defaultCode: `#include <stdio.h>
          int main() {
            printf("Hello, World!\\n");
              return 0;
          }`,
  },
  {
    name: "C++",
    id: 54,
    defaultCode: `#include <iostream>
                      using namespace std;
                      int main() {
                          cout << "Hello, World!" << endl;
                          return 0;
                      }`,
  },
  {
    name: "PY",
    id: 71,
    defaultCode: `print("Hello, World!")`,
  },
  {
    name: "JAVA",
    id: 62,
    defaultCode: `public class Main {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
          }
        }`,
  },
  {
    name: "C#",
    id: 51,
    defaultCode: `using System;
                      class Program {
                          static void Main() {
                              Console.WriteLine("Hello, World!");
                          }
                      }`,
  },
];
