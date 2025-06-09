from flask import Flask, request, jsonify,render_template,session,redirect,url_for
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

app.secret_key = 'ad65GANd5uns'


@app.route('/',methods=['GET'])
def home():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html',user=session['user'])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username == 'admin' and password == '1234':
            session['user'] = username
            return redirect(url_for('home'))
        else:
            return "Invalid credentials", 401

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


@app.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '').lower()
    con = sqlite3.connect("data.db")
    cursor = con.cursor()
    cursor.execute("SELECT id,name, price FROM products WHERE name LIKE ?", ('%'+query+'%',))
    results = cursor.fetchall()
    con.close()
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
