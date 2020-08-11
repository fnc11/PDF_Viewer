import os

from flask import Flask, render_template, request, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder="static")
app.config['SECRET_KEY'] = '1c91c0864a032475627dcc6f1c635c71'
app.config["UPLOAD_LOC"] = "static/uploads"
ALLOWED_FILE_EXTENSIONS = ["pdf"]
app.config["MAX_FILE_SIZE"] = 50 * 1024 * 1024  # 50 MB max

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pdfs.db'
db = SQLAlchemy(app)


class Info(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(100), unique=True, nullable=False)
    last_viewed = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    tags = db.relationship('Tag', backref='pdf_file', lazy=True)

    def __repr__(self):
        return "PDF Info, ID: " + str(self.id) + " Name: " + self.file_name


# Tag model is dependent upon the PDF file, if file is deleted all the tags will also be deleted
# it is also dependent on tag types, if tag type is deleted tags will also be deleted from all pdfs
class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag_type = db.Column(db.String(60), nullable=False)
    pdf_id = db.Column(db.Integer, db.ForeignKey('info.id'), nullable=False)

    def __repr__(self):
        return "Tag Info, ID: " + str(self.id) + "PDF ID: " + str(self.pdf_id) + " Tag_type: " + self.tag_type


#     location or track how it is tied to the text location in file

class TagType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag_desc = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return "Tag Type, id: " + self.id + " Description: " + self.tag_desc


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_FILE_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_LOC'], filename))
            return redirect(url_for('show', filename=filename))
    return render_template('index.html')


@app.route('/show/<string:filename>')
def show(filename):
    file_path = os.path.join(app.config['UPLOAD_LOC'], filename)
    print(file_path)
    return render_template("show.html", tags=[], filename=filename)


if __name__ == '__main__':
    app.run(debug=True)
