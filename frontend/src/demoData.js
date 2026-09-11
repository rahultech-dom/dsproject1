// Pre-computed fallback dataset for public web hosting (e.g. Vercel)
// Enables recruiters & visitors on mobile/cloud to test the interactive video RAG without local Ollama.

export const DEMO_VIDEOS = [
  {
    video_id: "_bM7HK530PE",
    title: "C++ Programming Full Course (Demo)",
    chunks_count: 2126,
    url: "https://www.youtube.com/watch?v=_bM7HK530PE",
  }
];

export const DEMO_CHUNKS = [
  {
    chunk_id: 1,
    title: "C++ Programming Full Course (Demo)",
    start: 2.32,
    end: 6.68,
    start_formatted: "00:02",
    end_formatted: "00:06",
    text: "Welcome to the ultimate C++ course. In this course you're going to learn everything you need to know about C++ from the basics to more advanced concepts."
  },
  {
    chunk_id: 2,
    title: "C++ Programming Full Course (Demo)",
    start: 10.32,
    end: 18.45,
    start_formatted: "00:10",
    end_formatted: "00:18",
    text: "C++ is one of the most popular, fast, and high-performance programming languages in the world, powering game engines, operating systems, and finance."
  },
  {
    chunk_id: 3,
    title: "C++ Programming Full Course (Demo)",
    start: 25.10,
    end: 38.60,
    start_formatted: "00:25",
    end_formatted: "00:38",
    text: "Before writing code, we need to understand how C++ programs are compiled. Source code gets converted by the compiler into machine code that the CPU executes directly."
  },
  {
    chunk_id: 4,
    title: "C++ Programming Full Course (Demo)",
    start: 45.20,
    end: 59.80,
    start_formatted: "00:45",
    end_formatted: "00:59",
    text: "Variables in C++ must have a declared type, such as int, double, float, char, and bool. Understanding memory allocation and data types is crucial."
  },
  {
    chunk_id: 5,
    title: "C++ Programming Full Course (Demo)",
    start: 72.00,
    end: 95.30,
    start_formatted: "01:12",
    end_formatted: "01:35",
    text: "Pointers and references allow direct memory manipulation in C++. A pointer stores the memory address of another variable using the address-of operator (&) and dereference operator (*)."
  },
  {
    chunk_id: 6,
    title: "C++ Programming Full Course (Demo)",
    start: 120.00,
    end: 145.00,
    start_formatted: "02:00",
    end_formatted: "02:25",
    text: "Object-oriented programming in C++ revolves around classes, objects, encapsulation, inheritance, and polymorphism."
  }
];

export const DEMO_PRESET_ANSWERS = {
  default: {
    answer: `**C++ Full Course Overview**\n\n* **Language Performance**: C++ is a high-performance, compiled programming language [00:10] used widely in game engines, operating systems, embedded systems, and financial trading.\n* **Compilation Pipeline**: Unlike interpreted languages, C++ source code is directly compiled into machine code [00:25] that the CPU executes natively.\n* **Memory Management & Pointers**: Direct memory management is a hallmark of C++, utilizing pointers and references [01:12] to store and manipulate memory addresses.\n* **Object-Oriented Programming**: The course teaches classes, encapsulation, inheritance, and polymorphism [02:00] for scalable software design.`,
    sources: [
      {
        start: 10.32,
        end: 18.45,
        start_formatted: "00:10",
        end_formatted: "00:18",
        match_percent: 94.2,
        text: "C++ is one of the most popular, fast, and high-performance programming languages in the world, powering game engines, operating systems, and finance."
      },
      {
        start: 25.10,
        end: 38.60,
        start_formatted: "00:25",
        end_formatted: "00:38",
        match_percent: 91.0,
        text: "Before writing code, we need to understand how C++ programs are compiled. Source code gets converted by the compiler into machine code that the CPU executes directly."
      },
      {
        start: 72.00,
        end: 95.30,
        start_formatted: "01:12",
        end_formatted: "01:35",
        match_percent: 88.6,
        text: "Pointers and references allow direct memory manipulation in C++. A pointer stores the memory address of another variable using the address-of operator (&)."
      }
    ]
  },
  summary: `**Executive Summary**\n\nThis video provides a complete masterclass on modern C++ programming from the absolute ground up. It guides developers through syntax, compilation mechanics, memory management, and modern object-oriented principles.\n\n**Key Takeaways**:\n* **High Performance**: Direct compilation to machine code provides maximum runtime speed [00:25].\n* **Type Safety & Variables**: Strong static typing with primitives like int, double, and char [00:45].\n* **Pointers & Memory**: Direct hardware access and memory manipulation using pointers and references [01:12].\n* **Object-Oriented Design**: Encapsulation, inheritance, and polymorphism [02:00].`
};
