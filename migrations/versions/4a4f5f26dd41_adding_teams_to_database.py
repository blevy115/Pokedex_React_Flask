"""Adding Teams to database

Revision ID: 4a4f5f26dd41
Revises: a340d3c1b6cb
Create Date: 2023-12-01 22:50:17.674185

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4a4f5f26dd41'
down_revision = 'a340d3c1b6cb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('team',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('team_pokemon',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.Column('pokemon_id', sa.Integer(), nullable=True),
    sa.Column('move1_id', sa.Integer(), nullable=True),
    sa.Column('move2_id', sa.Integer(), nullable=True),
    sa.Column('move3_id', sa.Integer(), nullable=True),
    sa.Column('move4_id', sa.Integer(), nullable=True),
    sa.Column('ability_id', sa.Integer(), nullable=True),
    sa.Column('item_id', sa.Integer(), nullable=True),
    sa.Column('position', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['ability_id'], ['ability.id'], ),
    sa.ForeignKeyConstraint(['item_id'], ['item.id'], ),
    sa.ForeignKeyConstraint(['move1_id'], ['move.id'], ),
    sa.ForeignKeyConstraint(['move2_id'], ['move.id'], ),
    sa.ForeignKeyConstraint(['move3_id'], ['move.id'], ),
    sa.ForeignKeyConstraint(['move4_id'], ['move.id'], ),
    sa.ForeignKeyConstraint(['pokemon_id'], ['pokemon.id'], ),
    sa.ForeignKeyConstraint(['team_id'], ['team.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('team_id', 'position', name='_team_position_uc')
    )
    with op.batch_alter_table('pokemon', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type1_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('type2_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('type1_id', 'type', ['type1_id'], ['id'])
        batch_op.create_foreign_key('type2_id', 'type', ['type2_id'], ['id'])

    op.create_check_constraint(
            '_position_check',
            'team_pokemon',
            ('position >= 1 AND position <= 6')
        )
    

    op.create_unique_constraint(
        'unique_moves_for_team_pokemon',
        'team_pokemon',
        ['move1_id', 'move2_id', 'move3_id', 'move4_id']
    )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pokemon', schema=None) as batch_op:
        batch_op.drop_constraint('type1_id', type_='foreignkey')
        batch_op.drop_constraint('type2_id', type_='foreignkey')
        batch_op.drop_column('type2_id')
        batch_op.drop_column('type1_id')

    op.drop_table('team_pokemon')
    op.drop_table('team')
    # ### end Alembic commands ###
