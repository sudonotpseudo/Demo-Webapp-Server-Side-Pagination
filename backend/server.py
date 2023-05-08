from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import cast, String
from sqlalchemy.sql import func
from sqlalchemy.inspection import inspect
from flask_migrate import Migrate
from datetime import datetime

# Initializing flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/demo_db"
db = SQLAlchemy(app)
migrate = Migrate(app, db)



#Define Serializer
class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]


# Create Classes for Tables
class Projects(db.Model, Serializer):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    start_date = db.Column(db.TIMESTAMP, unique=False, nullable=False)

    def __init__(self, name, start_date):
        self.name = name
        self.start_date = start_date

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "start_date": self.start_date.strftime("%m/%d/%Y")
            }

    def __repr__(self):
        return f'<Project {self.name}>'

class Users(db.Model, Serializer):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    def __init__(self, name, email):
        self.name = name
        self.email = email

    def __repr__(self):
        return f'<User {self.name}>'
    
class Files(db.Model, Serializer):
    __tablename__ = 'files'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    type = db.Column(db.String(100), unique=False, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    def __init__(self, name, type, project_id):
        self.name = name
        self.type = type
        self.project_id = project_id

    def __repr__(self):
        return f'<File {self.name} ({self.type})>'
    
#Create Bridge Table for Users <-> Projects
class Users_Assignment(db.Model, Serializer):
    __tablename__ = 'users_assignment'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    db.UniqueConstraint(user_id, project_id)

    def __init__(self, user_id, project_id):
        self.user_id = user_id
        self.project_id = project_id

    def __repr__(self):
         return f'<{self.user_id} - {self.project_id}>'

# Routes for API GET Requests

@app.route('/api/projects', methods=['GET'])
def get_projects():
    args = request.args
    page_size = int(args.get('page_size', 20))
    page = int(args.get('page', 1))
    filters = {k:args[k] for k in args if k in ["name", "start_date", "id"]}
    sort = args.get('sort')
    #sort_type expects 3 possible values: ['asc', 'desc', None]
    sort_type = args.get('sort_type')
    queryset = Projects.query
    
    #apply filters
    for attr, value in filters.items():
        if attr == "name":
            queryset = queryset.filter(Projects.name.like(f"%{value}%"))
        elif attr == "id":
            queryset = queryset.filter(cast(Projects.id, String).like(f"%{value}%"))
        elif attr == "start_date":
            #TODO [BW] Confirm with team whether or not to treat Start Date at String or Timestamp for purposes of filtering
            #For the time being, disallow filtering on this field
            [c, d] = value.split(",")
            d = datetime.strptime(d, "%Y-%m-%d")
            match(c):
                case "=":
                    queryset = queryset.filter(Projects.start_date == d)
                case "!=":
                    queryset = queryset.filter(Projects.start_date != d)
                case ">":
                    queryset = queryset.filter(Projects.start_date > d)
                case ">=":
                    queryset = queryset.filter(Projects.start_date >= d)
                case "<":
                    queryset = queryset.filter(Projects.start_date < d)
                case "<=":
                    queryset = queryset.filter(Projects.start_date <= d)
                case "_":
                    pass
            #queryset = queryset.filter(Projects.start_date.like(f"%{value}%"))
            pass
    
    #apply sort and sort order
    match(sort_type):
        case "asc":
            if sort == "name":
                queryset = queryset.order_by(Projects.name.asc())
            elif sort == "id":
                queryset = queryset.order_by(Projects.id.asc())
            elif sort == "start_date":
                queryset = queryset.order_by(Projects.start_date.asc())
        case "desc":
            if sort == "name":
                queryset = queryset.order_by(Projects.name.desc())
            elif sort == "id":
                queryset = queryset.order_by(Projects.id.desc())
            elif sort == "start_date":
                queryset = queryset.order_by(Projects.start_date.desc())
        case "_":
            pass
        
    #queryset = queryset.order_by()

    #queryset= queryset.filter_by(**filters)

    queryset = queryset.paginate(page=page, per_page=page_size)
    #queryset = Projects.query.filter().paginate(page=page, per_page=page_size)
    
    result = dict(
        data = [q.serialize() for q in queryset],
        total = queryset.total,
        current_page = queryset.page,
        per_page = queryset.per_page
        )
    return result

@app.route('/api/users', methods=['GET'])
def get_users():
    args = request.args
    project_id = int(args.get("project_id"))
    page_size = int(args.get('page_size', 20))
    page = int(args.get('page', 1))
    filters = {k:args[k] for k in args if k in ["name", "email", "id"]}
    sort = args.get('sort')
    #sort_type expects 3 possible values: ['asc', 'desc', None]
    sort_type = args.get('sort_type')
    queryset = Users.query.join(Users_Assignment, Users_Assignment.user_id==Users.id)
    queryset = queryset.filter(Users_Assignment.project_id==project_id)
    
    #apply filters
    for attr, value in filters.items():
        if attr == "name":
            queryset = queryset.filter(Users.name.like(f"%{value}%"))
        elif attr == "id":
            queryset = queryset.filter(cast(Users.id, String).like(f"%{value}%"))
        elif attr == "email":
            queryset = queryset.filter(Users.email.like(f"%{value}%")) 
    
    #apply sort and sort order
    match(sort_type):
        case "asc":
            if sort == "name":
                queryset = queryset.order_by(Users.name.asc())
            elif sort == "id":
                queryset = queryset.order_by(Users.id.asc())
            elif sort == "email":
                queryset = queryset.order_by(Users.email.asc())
        case "desc":
            if sort == "name":
                queryset = queryset.order_by(Users.name.desc())
            elif sort == "id":
                queryset = queryset.order_by(Users.id.desc())
            elif sort == "email":
                queryset = queryset.order_by(Users.email.desc())
        case "_":
            pass
        
    #queryset = queryset.order_by()

    #queryset= queryset.filter_by(**filters)

    queryset = queryset.paginate(page=page, per_page=page_size)
    #queryset = Projects.query.filter().paginate(page=page, per_page=page_size)
    
    result = dict(
        data = [q.serialize() for q in queryset],
        total = queryset.total,
        current_page = queryset.page,
        per_page = queryset.per_page
        )
    return result

@app.route('/api/files', methods=['GET'])
def get_files():
    args = request.args
    project_id = int(args.get("project_id"))
    page_size = int(args.get('page_size', 20))
    page = int(args.get('page', 1))
    filters = {k:args[k] for k in args if k in ["name", "type", "id"]}
    sort = args.get('sort')
    #sort_type expects 3 possible values: ['asc', 'desc', None]
    sort_type = args.get('sort_type')
    queryset = Files.query.join(Projects, Projects.id==Files.project_id)
    queryset = queryset.filter(Files.project_id==project_id)
    
    #apply filters
    for attr, value in filters.items():
        if attr == "name":
            queryset = queryset.filter(Files.name.like(f"%{value}%"))
        elif attr == "id":
            queryset = queryset.filter(cast(Files.id, String).like(f"%{value}%"))
        elif attr == "type":
            queryset = queryset.filter(Files.type.like(f"%{value}%")) 
    
    #apply sort and sort order
    match(sort_type):
        case "asc":
            if sort == "name":
                queryset = queryset.order_by(Files.name.asc())
            elif sort == "id":
                queryset = queryset.order_by(Files.id.asc())
            elif sort == "type":
                queryset = queryset.order_by(Files.type.asc())
        case "desc":
            if sort == "name":
                queryset = queryset.order_by(Files.name.desc())
            elif sort == "id":
                queryset = queryset.order_by(Files.id.desc())
            elif sort == "type":
                queryset = queryset.order_by(Files.type.desc())
        case "_":
            pass
        
    #queryset = queryset.order_by()

    #queryset= queryset.filter_by(**filters)

    queryset = queryset.paginate(page=page, per_page=page_size)
    #queryset = Projects.query.filter().paginate(page=page, per_page=page_size)
    
    result = dict(
        data = [q.serialize() for q in queryset],
        total = queryset.total,
        current_page = queryset.page,
        per_page = queryset.per_page
        )
    return result

	
# Running app
if __name__ == '__main__':
	app.run(debug=True)
