import uvicorn
import test_mpld3.main

uvicorn.run(
    test_mpld3.main.app, host='127.0.0.1',
    port=5000, log_level='debug'
)
