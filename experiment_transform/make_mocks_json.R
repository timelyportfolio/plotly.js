library(htmltools)

lf <- list.files("./test/image/mocks")

cat(jsonlite::toJSON(lf),file="experiment_transform/mocks.json")
