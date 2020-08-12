import os

from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder="static")
app.config['SECRET_KEY'] = '1c91c0864a032475627dcc6f1c635c71'
app.config["UPLOAD_LOC"] = "static/uploads"
ALLOWED_FILE_EXTENSIONS = ["pdf"]
app.config["MAX_FILE_SIZE"] = 50 * 1024 * 1024  # 50 MB max

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pdftags.db'
db = SQLAlchemy(app)


# class Info(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     file_name = db.Column(db.String(100), unique=True, nullable=False)
#     page_tags = db.relationship('PageTag', backref='pdf_file', lazy=True)
#
#     def __repr__(self):
#         return "PDF Info, ID: " + str(self.id) + " Name: " + self.file_name


# Tag model is dependent upon the PDF file, if file is deleted all the tags will also be deleted
# it is also dependent on tag types, if tag type is deleted tags will also be deleted from all pdfs
class PageTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # pdf_id = db.Column(db.Integer, db.ForeignKey('info.id'), nullable=False)
    pdf_name = db.Column(db.String(100), nullable=False)
    page_num = db.Column(db.Integer, nullable=False)
    serialized_val = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return "Page Tag Info, ID: " + str(self.id) + "PDF Name: " + self.pdf_name + "Page no: " + str(
            self.page_num) + "serialized_val: " + self.serialized_val


class TagType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(100), unique=True, nullable=False)
    tag_color = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return "Tag Type, id: " + self.id + " Name: " + self.tag_name+" Color: "+self.tag_color


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


@app.route('/save_tag_info', methods=['POST'])
def save_tag_info():
    req = request.get_json()
    page_tag_info = PageTag.query.filter_by(pdf_name=req['pdf_name'], page_num=req['page_num']).first()
    if page_tag_info is not None:
        page_tag_info.serialized_val = req['serialized_val']
    else:
        page_tag_info = PageTag(pdf_name=req['pdf_name'], page_num=req['page_num'],
                                serialized_val=req['serialized_val'])
        db.session.add(page_tag_info)

    db.session.commit()
    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@app.route('/get_tag_info/<string:pdf_name>/<int:page_num>')
def get_tag_info(pdf_name, page_num):
    page_tag_info = PageTag.query.filter_by(pdf_name=pdf_name, page_num=page_num).first()
    if page_tag_info is not None:
        res = make_response(jsonify({"message": "OK",
                                     "value": "valid",
                                     "serialized_val": page_tag_info.serialized_val}), 200)
    else:
        res = make_response(jsonify({"message": "OK",
                                     "value": "not valid",
                                     "serialized_val": "No tag exist"}), 200)

    return res


if __name__ == '__main__':
    app.run(debug=True)
