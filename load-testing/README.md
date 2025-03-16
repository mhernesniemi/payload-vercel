# Locust.io load and performance testing environment

This is a Locust.io testing package designed for load testing of Payload CMS's Next.js application.

### Features

- Search functionality
- Page load times
- API calls
- Media file loading

## Configuration

All essential configurations can be found in the `configs.py` file. Modify these parameters according to your needs. All parameters have been set with sensible default values that will likely work directly.

Below are explanations for some of the less obvious parameters:

**VERIFY_SSL** bool - Verify SSL chain  
**WAIT_TIME_MIN** - int - Minimum time for client to wait between requests  
**WAIT_TIME_MAX** - int - Maximum time for client to wait between requests  
**USE_SEARCH** - bool - Enable/disable search feature  
**SEARCH_TERMS** - list - Search terms to be used in searches

## Payload CMS Structure

This load testing environment is configured to match the specific Payload CMS structure of the project. Based on `payload.config.ts`, the following collections are tested:

- **Articles**: Primary content type with rich text support
- **Collection Pages**: Structured pages with ordered content
- **News**: Time-sensitive updates and announcements
- **Categories**: Hierarchical content organization
- **Contacts**: Contact information entries
- **Media**: All uploaded files and images

The test handles localization with both Finnish (`fi`) and English (`en`), with Finnish set as the default locale.

**NOTE:** The host is defined after starting the program.

## Usage

- run `bash setup.sh` to set up Python virtual environment and install dependencies
- check `configs.py` and modify if necessary
- create a `.env` file with the correct values according to the `.env.example` file
- run `source venv/bin/activate` to activate the virtual environment
- run `locust` to start the web interface

`wait_time` defines the range of seconds each client waits before executing a new task.  
`weight` can be added to either individual tasks or entire user classes. See the [documentation](http://docs.locust.io/en/stable/writing-a-locustfile.html#weight-and-fixed-count-attributes) for more information.
