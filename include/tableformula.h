#pragma once

#include <string_view>

const auto tableFormulaSrc = std::string_view{R"_(
<script>
${markdown_formula}
</script>

<script>
${markdown_evaluate}
</script>
)_"};
