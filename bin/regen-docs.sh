set -e

# A script to regenerate protobuf documentation markdown
# using "go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc"

docker run --rm \
  -v $(pwd)/docs:/out \
  -v $(pwd):/protos \
  pseudomuto/protoc-gen-doc --doc_opt=markdown,docs.md
