import os
import logging
from flask import Flask, render_template, request, jsonify, send_from_directory
import werkzeug.utils
import uuid
from font_processor import process_font
from flask_cors import CORS  # Importamos flask_cors

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-dev-secret")

# Habilitamos CORS para todas las rutas
CORS(app)

# Create upload and processed folders if they don't exist
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_font():
    if 'fontFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    font_file = request.files['fontFile']
    
    if font_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file extension
    filename = font_file.filename
    file_ext = os.path.splitext(filename)[1].lower()
    
    if file_ext not in ['.otf', '.ttf']:
        return jsonify({'error': 'Only .otf and .ttf files are allowed'}), 400
    
    # Generate unique filename to prevent collisions
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    upload_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    
    try:
        # Save uploaded file
        font_file.save(upload_path)
        logger.debug(f"File saved to {upload_path}")
        
        # Get original filename before saving with UUID
        original_filename = os.path.basename(font_file.filename)
        original_name, ext = os.path.splitext(original_filename)
        
        # Process font file
        output_path = process_font(upload_path, PROCESSED_FOLDER)
        
        if output_path is None:
            return jsonify({'error': 'Failed to process font file'}), 500
        
        # Return the filename for download
        processed_filename = os.path.basename(output_path)
        
        # Store original name in session for download
        return jsonify({
            'success': True, 
            'message': 'Font processed successfully!',
            'filename': processed_filename,
            'originalName': original_name
        })
        
    except Exception as e:
        logger.error(f"Error processing font: {str(e)}")
        return jsonify({'error': f'Error processing font: {str(e)}'}), 500

@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    # Check if file exists in the processed folder
    if not os.path.exists(os.path.join(PROCESSED_FOLDER, filename)):
        logger.error(f"File not found: {filename}")
        return jsonify({'error': 'File not found'}), 404
    
    # Get the original font name from the file itself
    original_name = filename
    if filename.startswith("Not with my"):
        # The file already has the correct prefix
        pass
    else:
        # Add the prefix for downloading
        original_name = f"Not with my {filename}"
    
    logger.debug(f"Sending file: {filename} with download name: {original_name}")
    
    return send_from_directory(
        directory=PROCESSED_FOLDER, 
        path=filename, 
        as_attachment=True,
        download_name=original_name
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
