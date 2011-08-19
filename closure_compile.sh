java -jar compiler.jar --js webgldiagdata.js --js webgldiagnostic.js --compilation_level ADVANCED_OPTIMIZATIONS --create_name_map_files --externs externs.js --js_output_file ./webgldiag.min.js --warning_level VERBOSE &> closure_compile.log

