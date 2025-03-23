from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from app.schema.graphql_schema import schema
from app.routes.api import api_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True),
    )

    app.register_blueprint(api_bp)

    return app
