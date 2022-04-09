
project(markdown-formula)

add_library(
    ${PROJECT_NAME}
    INTERFACE)

add_library(${PROJECT_NAME}::${PROJECT_NAME} ALIAS ${PROJECT_NAME})

target_include_directories(
    ${PROJECT_NAME}
    INTERFACE
    ${CMAKE_CURRENT_BINARY_DIR}/include/
    )

file(READ tableformula.js markdown_formula)
file(READ evaluate.js markdown_evaluate)

configure_file(
    include/tableformula.h
    ${CMAKE_CURRENT_BINARY_DIR}/include/${PROJECT_NAME}/tableformula.h
    )

configure_file(
    README.md
    .
    COPY_ONLY
    )



