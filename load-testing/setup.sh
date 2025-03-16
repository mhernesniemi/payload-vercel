# get absolute script path and cd to it
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $SCRIPTPATH

# setup venv and install dependencies
echo "creating Python virtual environment..."
python3 -m venv venv
echo "activating virtual environment..."
source $SCRIPTPATH/venv/bin/activate
echo "installing dependencies..."
pip3 install -r requirements.txt

echo "done"
echo "Python virtual environment set up and packages installed successfully"
echo "Before starting, please edit configs.py to suite your needs. README for more info."
echo "Happy testing!"