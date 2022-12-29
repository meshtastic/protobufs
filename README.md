# Black-Lager Protobuf Definition

This repository contains all protobuf definition for black-lager

## What is protobuf

Protocol buffers are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data – think XML, but smaller, faster, and simpler. You define how you want your data to be structured once, then you can use special generated source code to easily write and read your structured data to and from a variety of data streams and using a variety of languages. Currently supported languages are C++, C#, Dart, Python, Java, Kotlin and Go.


## Usage

### Download protocol buffer

To create a class, we need to generate the class based on ```.proto``` files with the help of protocol buffers which can be downloaded [here](https://github.com/protocolbuffers/protobuf/releases/tag/v21.11). 

### Compile protobuf class
Next step is to run the compiler, specifying the source directory (where your application's source code lives – the current directory is used if you don't provide a value), the destination directory (where you want the generated code to go; often the same as $SRC_DIR), and the path to your .proto.

```bash
protoc -I=$SRC_DIR --python_out=$DST_DIR $SRC_DIR/FILENAME.proto
```

### Example of protobuf class in code
The programmer generated an addressbook_pb2 class using his addressbook_pb2.proto definition. To use the generated class, simply import the file as a module, after that you can access the protobuf definition accordingly.

```python
import addressbook_pb2
person = addressbook_pb2.Person()
person.id = 1234
person.name = "John Doe"
person.email = "jdoe@example.com"
phone = person.phones.add()
phone.number = "555-4321"
phone.type = addressbook_pb2.Person.HOME
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
