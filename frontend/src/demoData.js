// Pre-computed fallback dataset for public web hosting (e.g. Vercel)
// Enables recruiters & visitors on mobile/cloud to test the interactive video RAG without local Ollama.

export const DEMO_VIDEOS = [
  {
    video_id: "vLnPwxZdW4Y",
    title: "C++ Tutorial for Beginners - Full Course",
    chunks_count: 2126,
    url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
  }
];

export const DEMO_CHUNKS = [
  {
    chunk_id: 1,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 2.32,
    end: 6.68,
    start_formatted: "00:02",
    end_formatted: "00:06",
    text: "Welcome to the ultimate C++ course. In this course you're going to learn everything you need to know about C++ from the basics to more advanced concepts."
  },
  {
    chunk_id: 2,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 10.32,
    end: 18.45,
    start_formatted: "00:10",
    end_formatted: "00:18",
    text: "C++ is one of the most popular, fast, and high-performance programming languages in the world, powering game engines, operating systems, and finance."
  },
  {
    chunk_id: 3,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 25.10,
    end: 38.60,
    start_formatted: "00:25",
    end_formatted: "00:38",
    text: "Before writing code, we need to understand how C++ programs are compiled. Source code gets converted by the compiler into machine code that the CPU executes directly."
  },
  {
    chunk_id: 4,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 45.20,
    end: 59.80,
    start_formatted: "00:45",
    end_formatted: "00:59",
    text: "Variables in C++ must have a declared type, such as int, double, float, char, and bool. Understanding memory allocation and data types is crucial."
  },
  {
    chunk_id: 5,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 72.00,
    end: 95.30,
    start_formatted: "01:12",
    end_formatted: "01:35",
    text: "Pointers and references allow direct memory manipulation in C++. A pointer stores the memory address of another variable using the address-of operator (&) and dereference operator (*)."
  },
  {
    chunk_id: 6,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 105.00,
    end: 125.00,
    start_formatted: "01:45",
    end_formatted: "02:05",
    text: "When you dereference a pointer with the asterisk operator, you read or modify the actual value located at that specific memory address on the heap or stack."
  },
  {
    chunk_id: 7,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 130.00,
    end: 155.00,
    start_formatted: "02:10",
    end_formatted: "02:35",
    text: "Functions in C++ allow modular code reuse. Parameters can be passed by value, which creates a copy, or passed by reference using pointers or ampersand (&) to avoid expensive copies."
  },
  {
    chunk_id: 8,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 160.00,
    end: 185.00,
    start_formatted: "02:40",
    end_formatted: "03:05",
    text: "Arrays and strings in C++ are collections of contiguous memory. An array name actually acts as a constant pointer pointing to the memory address of the first element."
  },
  {
    chunk_id: 9,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 190.00,
    end: 220.00,
    start_formatted: "03:10",
    end_formatted: "03:40",
    text: "Control flow in C++ includes if-else conditional branches, switch statements, while loops, and for loops for iterating through collections and data streams."
  },
  {
    chunk_id: 10,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 230.00,
    end: 265.00,
    start_formatted: "03:50",
    end_formatted: "04:25",
    text: "Object-oriented programming in C++ revolves around classes, objects, encapsulation, inheritance, and polymorphism. Classes define blueprints with public and private member variables."
  },
  {
    chunk_id: 11,
    title: "C++ Tutorial for Beginners - Full Course",
    start: 275.00,
    end: 310.00,
    start_formatted: "04:35",
    end_formatted: "05:10",
    text: "Constructors initialize objects when instantiated, while destructors clean up dynamically allocated resources to prevent memory leaks in C++."
  }
];
