from flask import Flask, request, jsonify
from process import setup,set_dest_checkpoint

app = Flask(__name__)

@app.route('/setdestination', methods=['POST'])
def set_destination():
    data = request.json
    if 'dest_checkpoint' in data:
        dest_checkpoint = data['dest_checkpoint']
        set_dest_checkpoint(dest_checkpoint)
        
        return jsonify({'message': f'Destination checkpoint set to {dest_checkpoint}'})
    else:
        return jsonify({'error': 'Invalid JSON format or missing destination checkpoint'}), 400

@app.route('/getInstructions', methods=['POST'])
def get_instructions():
    # Here, you can access the image file sent to the server
    
    data = request.json
    file = data['frame']
    
    if not file:
        return jsonify({'error': 'No file part in the request'}), 400

    insturction = setup(file)
    return jsonify({'message': insturction})

if __name__ == '__main__':
    app.run(debug=True)
