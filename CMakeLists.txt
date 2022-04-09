
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

file(
    COPY include/tables/tableformula.h
    DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/include/${PROJECT_NAME}
    )

