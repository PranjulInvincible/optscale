""""role_purpose_as_enum"

Revision ID: 0f2b068b24b3
Revises: 7cdb069460b5
Create Date: 2020-06-30 06:50:02.367724

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0f2b068b24b3"
down_revision = "7cdb069460b5"
branch_labels = None
depends_on = None


role_purposes = sa.Enum("optscale_member", "optscale_engineer", "optscale_manager")


def upgrade():
    op.alter_column(
        "recipient", "role_purpose", existing_type=role_purposes, nullable=False
    )


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
